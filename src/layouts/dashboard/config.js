import {
  ArrowPathRoundedSquareIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  ReceiptPercentIcon,
  ShoppingBagIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/solid';

import { SvgIcon } from '@mui/material';

export const SCREENS = {
  OVERVIEW: 1,
  USERS: 2,
  PRODUCTS: 3,
  TERMS: 4,
  INTEREST_RATES: 5,
  PAYMENT_METHODS: 6,
  ROLLOVER_PLANS: 7,
  CUSTOMERS: 8,
  ACCOUNTS: 9,
  TRANSACTIONS: 10,
};

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.OVERVIEW,
  },

  {
    title: 'Users',
    path: '/users',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.USERS,
  },
  {
    title: 'Products',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.PRODUCTS,
  },
  {
    title: 'Terms',
    path: '/terms',
    icon: (
      <SvgIcon fontSize="small">
        <ClockIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.TERMS,
  },
  {
    title: 'Interest Rates',
    path: '/interest-rates',
    icon: (
      <SvgIcon fontSize="small">
        <ReceiptPercentIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.INTEREST_RATES,
  },
  {
    title: 'Payment Methods',
    path: '/payment-methods',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentDuplicateIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.PAYMENT_METHODS,
  },
  {
    title: 'Rollover Plans',
    path: '/rollover-plans',
    icon: (
      <SvgIcon fontSize="small">
        <ArrowPathRoundedSquareIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.ROLLOVER_PLANS,
  },
  {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.CUSTOMERS,
  },
  {
    title: 'Accounts',
    path: '/accounts',
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.ACCOUNTS,
  },
  {
    title: 'Transactions',
    path: '/transactions',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentCheckIcon />
      </SvgIcon>
    ),
    screenId: SCREENS.TRANSACTIONS,
  },
];
