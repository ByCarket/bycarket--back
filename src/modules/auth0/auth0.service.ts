import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from 'src/enums/roles.enum';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class Auth0Service {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Procesa un usuario autenticado con Auth0
   * Si no existe en la base de datos local, lo crea
   * Si existe, actualiza su información si es necesario
   */
  async processAuth0User(auth0Profile: any): Promise<User> {
    const { email, name, sub } = auth0Profile;
    
    // Verificar si el usuario ya existe en nuestra base de datos
    let user = await this.usersService.getUserByEmail(email);
    
    if (!user) {
      // Crear un nuevo usuario en nuestra base de datos
      const newUser = {
        email,
        name: name || email.split('@')[0],
        // Creamos una contraseña aleatoria que no se usará (los usuarios Auth0 autentican vía Auth0)
        password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        auth0Id: sub,
        // Otros campos requeridos en tu modelo User
        phone: '',
        country: '',
        city: '',
        address: '',
        role: Role.USER, // Rol por defecto
      };
      
      // Guardar el nuevo usuario
      user = await this.usersRepository.create(newUser);
      await this.usersRepository.save(user);
    } else if (!user.auth0Id) {
      // Si el usuario existe pero no tiene auth0Id, actualizarlo
      user.auth0Id = sub;
      await this.usersRepository.save(user);
    }
    
    return user;
  }

  /**
   * Genera un token JWT para un usuario de Auth0
   * Esto es opcional si decides usar solo tokens de Auth0
   */
  generateLocalTokenFromAuth0User(user: User): { token: string } {
    // Aquí podrías generar un token JWT local si lo necesitas
    // aunque podrías simplemente usar el token de Auth0 directamente
    return { token: 'auth0-authenticated' };
  }
}
