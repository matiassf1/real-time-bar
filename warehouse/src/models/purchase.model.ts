import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Purchase {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ingredientName!: string;

    @Column()
    quantityPurchased!: number;

    @CreateDateColumn()
    purchaseDate!: Date;
}
