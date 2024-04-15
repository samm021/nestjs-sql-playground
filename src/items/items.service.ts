import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { EntityManager, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    let listing = null;
    let tags = [];
    if (createItemDto.listing) {
      listing = new Listing({ ...createItemDto.listing });
    }
    if (createItemDto.tags && createItemDto.tags.length > 0) {
      tags = createItemDto.tags.map((tag) => new Tag(tag));
    }
    const item = new Item({
      ...createItemDto,
      listing: listing,
      comments: [],
      tags,
    });
    const savedItem = await this.itemRepository.save(item);

    return { id: savedItem.id };
  }

  async findAll() {
    return this.itemRepository.find({
      relations: {
        listing: true,
        comments: true,
      },
    });
  }

  async findOne(id: string) {
    return this.itemRepository.findOne({
      where: { id },
      relations: { listing: true, comments: true, tags: true },
    });
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    let comments = null;

    if (
      updateItemDto.comments &&
      updateItemDto.comments.hasOwnProperty('length')
    ) {
      comments = updateItemDto.comments.map((comment) => new Comment(comment));
    }

    const item = new Item({
      ...updateItemDto,
      comments,
      id,
    });

    const savedItem = await this.entityManager.transaction(
      async (entityManager: EntityManager) => {
        const tag = new Tag({ content: `${Math.random()}` });
        await entityManager.save(tag);

        return entityManager.save(item);
      },
    );

    return savedItem;
  }

  async remove(id: string) {
    await this.itemRepository.delete(id);
  }
}
