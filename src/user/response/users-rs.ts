import { UserItemRs } from './user-item-rs';

export interface UsersRs {
  users: UserItemRs[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}
