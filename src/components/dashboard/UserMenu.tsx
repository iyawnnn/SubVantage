"use client";

import { Avatar, Group, Text, Menu, UnstyledButton, rem } from "@mantine/core";
import { IconLogout, IconSettings, IconChevronDown } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  image?: string | null;
  name?: string | null;
  email?: string | null;
}

export function UserMenu({ image, name, email }: UserMenuProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7}>
            <Avatar src={image} radius="xl" size={30} />
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500} style={{ lineHeight: 1 }}>{name}</Text>
              <Text c="dimmed" size="xs" style={{ lineHeight: 1 }}>{email}</Text>
            </div>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
          Account settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item 
          color="red" 
          leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}