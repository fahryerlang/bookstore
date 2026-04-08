import { Icon, type IconProps } from "@iconify/react";

type AppIconProps = Omit<IconProps, "icon">;

function createIcon(iconName: string) {
  const AppIcon = (props: AppIconProps) => <Icon icon={iconName} {...props} />;
  AppIcon.displayName = `Icon(${iconName})`;
  return AppIcon;
}

export const ArrowLeft = createIcon("lucide:arrow-left");
export const ArrowRight = createIcon("lucide:arrow-right");
export const Award = createIcon("lucide:award");
export const Banknote = createIcon("lucide:banknote");
export const BookOpen = createIcon("lucide:book-open");
export const CheckCircle = createIcon("lucide:check-circle");
export const ChevronDown = createIcon("lucide:chevron-down");
export const CircleCheck = createIcon("lucide:circle-check");
export const Clock = createIcon("lucide:clock");
export const Clock3 = createIcon("lucide:clock-3");
export const CreditCard = createIcon("lucide:credit-card");
export const FolderOpen = createIcon("lucide:folder-open");
export const Heart = createIcon("lucide:heart");
export const LayoutDashboard = createIcon("lucide:layout-dashboard");
export const Loader2 = createIcon("lucide:loader-2");
export const LogOut = createIcon("lucide:log-out");
export const Mail = createIcon("lucide:mail");
export const MapPin = createIcon("lucide:map-pin");
export const Menu = createIcon("lucide:menu");
export const MessageSquare = createIcon("lucide:message-square");
export const Minus = createIcon("lucide:minus");
export const Package = createIcon("lucide:package");
export const Pencil = createIcon("lucide:pencil");
export const Phone = createIcon("lucide:phone");
export const Printer = createIcon("lucide:printer");
export const Plus = createIcon("lucide:plus");
export const Search = createIcon("lucide:search");
export const Shield = createIcon("lucide:shield");
export const ShieldCheck = createIcon("lucide:shield-check");
export const ShoppingBag = createIcon("lucide:shopping-bag");
export const ShoppingCart = createIcon("lucide:shopping-cart");
export const Sparkles = createIcon("lucide:sparkles");
export const Star = createIcon("lucide:star");
export const Tag = createIcon("lucide:tag");
export const Trash2 = createIcon("lucide:trash-2");
export const TrendingUp = createIcon("lucide:trending-up");
export const Truck = createIcon("lucide:truck");
export const User = createIcon("lucide:user");
export const UserRoundPlus = createIcon("lucide:user-round-plus");
export const Users = createIcon("lucide:users");
export const X = createIcon("lucide:x");
