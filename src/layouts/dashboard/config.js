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

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'Users',
    path: '/users',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Products',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Terms',
    path: '/terms',
    icon: (
      <SvgIcon fontSize="small">
        <ClockIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Interest Rates',
    path: '/interest-rates',
    icon: (
      <SvgIcon fontSize="small">
        <ReceiptPercentIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Payment Methods',
    path: '/payment-methods',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentDuplicateIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'RollOver Plans',
    path: '/rollover-plans',
    icon: (
      <SvgIcon fontSize="small">
        <ArrowPathRoundedSquareIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Bank Accounts',
    path: '/bank-accounts',
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'Transactions',
    path: '/transactions',
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentCheckIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'Customers',
    path: '/customers',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
  },
];
