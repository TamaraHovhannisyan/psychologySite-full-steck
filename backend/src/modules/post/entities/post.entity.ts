import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
  BeforeInsert,
  BeforeUpdate,
  VersionColumn,
} from 'typeorm';

export enum PostCategory {
  ARTICLES = 'articles',
  SELF_GROWTH = 'self-growth',
  PSYCHOLOGY = 'psychology',
}

@Entity({ name: 'posts' })
@Index('IDX_posts_title', ['title'])
@Index('IDX_posts_category', ['category'])
@Index('IDX_posts_published_created_at', ['published', 'createdAt'])
@Index('UQ_posts_slug_not_null', ['slug'], {
  unique: true,
  where: 'slug IS NOT NULL',
})
@Check(
  'CHK_posts_slug_kebab',
  "(slug IS NULL) OR (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')",
)
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 220, nullable: true })
  slug?: string | null;

  @Column({ type: 'text', nullable: true })
  content?: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  image?: string | null;

  @Column({ type: 'enum', enum: PostCategory, enumName: 'post_category_enum' })
  category: PostCategory;

  @Column({ type: 'boolean', default: true })
  published: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @BeforeInsert()
  @BeforeUpdate()
  private normalize() {
    if (typeof this.slug === 'string') {
      const v = this.slug.trim().toLowerCase();
      this.slug = v === '' ? null : v;
    }
    if (typeof this.image === 'string') {
      const v = this.image.trim();
      this.image = v === '' ? null : v;
    }
    if (typeof this.content === 'string' && this.content.trim() === '') {
      this.content = null;
    }
  }
}
