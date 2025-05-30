import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as cheerio from 'cheerio';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { VehicleVersion } from '../../interfaces/vehicleVersion.interface';

@Injectable()
export class AcaraScrapingService {
  private readonly BASE_URL = 'https://api.acara.org.ar/api/v1/prices';
  private readonly VEHICULE_TYPE = 1;
  private readonly DELAY_MS = 5000;
  private readonly MAX_RETRIES = 3;

  constructor(private readonly httpService: HttpService) {}

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(url: string, headers: any, retries = this.MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.httpService.get(url, { headers }).toPromise();
        return response?.data ?? null;
      } catch (error) {
        if (error.response?.status === 429 && attempt < retries) {
          console.warn(`⚠️  429 Too Many Requests. Reintento ${attempt}/${retries}...`);
          await this.sleep(this.DELAY_MS * attempt);
        } else {
          throw error;
        }
      }
    }
  }

  private async getVehiculeVersions(brandId: number, headers: any): Promise<VehicleVersion[]> {
    const url = `${this.BASE_URL}/get-vehicules?vehiculeType=${this.VEHICULE_TYPE}&vehiculeBrandId=${brandId}`;
    try {
      const response = await this.fetchWithRetry(url, headers);
      const $ = cheerio.load(response);
      const rows = $('table tbody tr');

      const versions: VehicleVersion[] = [];

      rows.each((_, row) => {
        const columns = $(row).find('td');
        const modelo = $(columns[0]).text().trim();
        const version = $(columns[1]).text().trim();
        if (modelo && version) versions.push({ modelo, version });
      });

      return versions;
    } catch (error) {
      console.error(`❌ Error get-vehicules brandId ${brandId}:`, error.message);
      return [];
    }
  }

  async scrapeData(authToken?: string): Promise<any> {
    const headers = authToken ? { Authorization: authToken } : {};
    const resultados: { marca: string; modeloId: any; modelo: string; versiones: string[] | null }[] = [];

    try {
      const brandsResponse = await this.fetchWithRetry(`${this.BASE_URL}/brand-list?vehiculeType=${this.VEHICULE_TYPE}`, headers);
      const brands = brandsResponse.data ?? [];

      for (const brand of brands) {
        const brandId = brand.id;
        const brandName = brand.name;
        await this.sleep(this.DELAY_MS);

        try {
          const modelosResponse = await this.fetchWithRetry(`${this.BASE_URL}/model-list?vehiculeType=${this.VEHICULE_TYPE}&vehiculeBrandId=${brandId}`, headers);
          const modelos = modelosResponse.data ?? [];
          console.log(`Marca ${brandName} (ID ${brandId}): ${modelos.length} modelos.`);

          const vehiculeVersions = await this.getVehiculeVersions(brandId, headers);

          modelos.forEach(modelo => {
            const versions = vehiculeVersions
              .filter(v => v.modelo.toLowerCase() === modelo.name.toLowerCase())
              .map(v => v.version);

            resultados.push({
              marca: brandName,
              modeloId: modelo.id,
              modelo: modelo.name,
              versiones: versions.length ? versions : null
            });
          });
        } catch (e) {
          console.error(`❌ Error model-list brandId ${brandId}:`, e.message);
        }
      }

      // ✅ Guardar el archivo en src/assets y sobrescribir si existe
      const outputDir = join(__dirname, '../../../assets');
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      const outputFile = join(outputDir, 'marcas_modelos_versiones_acara.json');
      writeFileSync(outputFile, JSON.stringify(resultados, null, 2));

      console.log(`✅ Archivo generado en ${outputFile} con ${resultados.length} modelos.`);
      return resultados;

    } catch (e) {
      console.error('❌ Error brand-list:', e.message);
      throw e;
    }
  }
}
