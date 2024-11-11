import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'enum',
        enum: ['Pending', 'In Kitchen', 'Completed', 'Failed'],
        default: 'Pending',
    })
    status!: 'Pending' | 'In Kitchen' | 'Completed' | 'Failed';

    @Column()
    dishName!: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
}
