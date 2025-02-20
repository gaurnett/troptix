import Head from 'next/head';
import { ReactNode } from 'react';
type MetaHeadProps = {
  title?: string;
  url?: string;
  description?: string;
  image?: string;
  children?: ReactNode;
};

export const MetaHead = ({
  title,
  url,
  description,
  image,
  children,
}: MetaHeadProps) => {
  const defaultTitle = 'Troptix';
  const defaultDescription = 'Troptix is a better way to get tickets';
  const defaultImage =
    'https://firebasestorage.googleapis.com/v0/b/troptix-prod.appspot.com/o/images%2Flogo_v1.png?alt=media&token=b4c2970f-1344-46b9-80d1-f5565ed93882'; // Replace with your default image path

  return (
    <Head>
      <title>{title || defaultTitle}</title>
      <meta
        name="description"
        content={description || defaultDescription}
        key={`desctiption`}
      />

      <meta property="og:title" content={title || defaultTitle} key={`title`} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta
        property="og:url"
        content="https://www.usetroptix.com/"
        key={`url`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image || defaultImage} key="image" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Troptix" />
      <meta property="twitter:domain" content="usetroptix.com" />
      <meta property="twitter:url" content={url || 'usetroptix.com'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image || defaultImage} />
      {/* Add additional meta tags or overwrite existing ones */}
      {children}
    </Head>
  );
};
