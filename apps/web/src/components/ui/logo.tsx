import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ width = 75, height = 75 }) {
  return (
    <Link href={'/'}>
      <Image
        src={'/logos/logo_v1.png'}
        width={width}
        height={height}
        alt="troptix-logo"
      />
    </Link>
  );
}
