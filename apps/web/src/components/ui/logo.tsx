import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href={'/'}>
      <Image
        src={'/logos/logo_v1.png'}
        width={75}
        height={75}
        alt="troptix-logo"
      />
    </Link>
  );
}
