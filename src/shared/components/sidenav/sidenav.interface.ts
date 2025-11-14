import { UserRole } from "@shared/models/types";
import { Page } from "@shared/models/enums";

export interface MenuItem {
  name: string;
  icon: string;
  active?: boolean;
  route: string;
  roles: UserRole[];
  feature?: Page;
}
