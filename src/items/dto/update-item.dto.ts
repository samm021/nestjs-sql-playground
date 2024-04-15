import { CreateCommentDto } from './create-comment.dto';

export class UpdateItemDto {
  name: string;
  public: boolean;
  comments: CreateCommentDto[];
}
