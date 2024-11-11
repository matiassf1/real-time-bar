export enum StatusEnum {
    inKitchen = 'In Kitchen',
    completed = 'Completed',
    failed = 'Failed'
}

export interface CreateOrderDto {
    name: string;
}

export interface UpdateOrderStatusDto {
    status: 'Pending' | 'In Kitchen' | 'Completed' | 'Failed';
}
