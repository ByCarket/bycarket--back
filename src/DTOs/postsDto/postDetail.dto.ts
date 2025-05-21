import { SellerInfoDto } from "./sellerInfo.dto";
import { ApiProperty } from "@nestjs/swagger";
import { VehicleDetailDto } from "../vehicleDto/vehicleDetail.dto";
import { PostStatus } from "src/enums/postStatus.enum";
import { Type } from "class-transformer";

export class PostDetail {
  @ApiProperty()
  @Type(() => SellerInfoDto)
  user: SellerInfoDto;

  @ApiProperty()
  @Type(() => VehicleDetailDto)
  vehicle: VehicleDetailDto;

  @ApiProperty()
  postDate: Date;

  @ApiProperty({
    enum: ['Active', 'Inactive', 'Rejected', 'Pending', 'Sold'],
  })
  status: PostStatus;
}