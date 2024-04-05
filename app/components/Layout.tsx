import { useLocation } from '@remix-run/react';
import { type PropsWithChildren } from 'react';

import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Title } from '~/components/Title';
import type { LogoProps } from '~/types/home';
import type { ThemePreference } from '~/types/themePreference';

export type LayoutProps = PropsWithChildren<
  LogoProps & { theme: ThemePreference }
>;

export function Layout({ home, theme, children }: LayoutProps) {
  const { pathname } = useLocation();

  return (
    <>
      {/* <Header home={home} theme={theme} /> */}
      <div>
        {home?.title && pathname === '/' ? <Title>{home?.title}</Title> : null}
        {children}
      </div>
      {/* <Footer home={home} /> */}
    </>
  );
}
