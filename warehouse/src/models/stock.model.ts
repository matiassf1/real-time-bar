import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stock_ingredient')
export class Stock {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ default: 5 })
    quantity!: number;

    public hasStock(requiredQuantity: number): boolean {
        return this.quantity >= requiredQuantity;
    }

    public use(quantity: number): void {
        if (this.hasStock(quantity)) {
            this.quantity -= quantity;
        } else {
            throw new Error(`No hay suficiente stock de ${this.name}`);
        }
    }

    public restock(quantity: number): void {
        this.quantity += quantity;
    }
}
