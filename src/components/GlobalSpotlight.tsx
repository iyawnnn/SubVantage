"use client";

import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { IconSearch, IconDashboard, IconArchive, IconPlus, IconReceipt } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { SubscriptionModal } from "./dashboard/SubscriptionModal";
import { rem } from "@mantine/core";
// Import styles in your layout or here if using css modules, 
// but usually Mantine V7 imports are in layout.
import '@mantine/spotlight/styles.css';

interface SimpleSub {
  id: string;
  vendorName: string;
}

export function GlobalSpotlight({ subscriptions }: { subscriptions: SimpleSub[] }) {
  const router = useRouter();
  
  // Modal State for "Add Subscription" action
  const [opened, { open, close }] = useDisclosure(false);

  const actions: SpotlightActionData[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Go to financial overview',
      onClick: () => router.push('/dashboard'),
      leftSection: <IconDashboard style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
    },
    {
      id: 'archive',
      label: 'Archive',
      description: 'View cancelled subscriptions',
      onClick: () => router.push('/archive'),
      leftSection: <IconArchive style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
    },
    {
      id: 'add-new',
      label: 'Add Subscription',
      description: 'Track a new expense',
      onClick: () => open(), // Triggers the modal
      leftSection: <IconPlus style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
    },
    // Dynamic Actions: Search existing subs
    ...subscriptions.map((sub) => ({
      id: sub.id,
      label: sub.vendorName,
      description: 'Go to subscription details',
      // For now, just go to dashboard, but ideally this would open the Edit Modal for this ID
      onClick: () => {
         router.push('/dashboard'); 
         // Advanced: You could use a URL query param like ?edit=ID to open modal on load
      },
      leftSection: <IconReceipt style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
    })),
  ];

  return (
    <>
      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
          placeholder: "Search subscriptions or actions...",
        }}
      />
      
      {/* This Modal lives here so Spotlight can trigger it globally */}
      <SubscriptionModal opened={opened} close={close} />
    </>
  );
}