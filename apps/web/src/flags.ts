import { flag } from 'flags/next';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const exampleFlag = flag({
  key: 'first-flag',
  defaultValue: true,
  decide() {
    return true;
  },
});

interface Entities {
  user_id: string;
  email: string;
}

export const openEventCreation = flag({
  key: 'open-event-creation',
  defaultValue: false,
  identify({ cookies }): Entities {
    const cookie = cookies.get('fb-token');
    const token = cookie?.value;
    const decoded = jwt.decode(token || '') as any;

    return { user_id: decoded?.user_id, email: decoded?.email };
  },
  decide({ entities }) {
    if (!entities) {
      return false;
    }
    const { email, user_id } = entities;
    if (!email || !user_id) {
      return false;
    }
    if (email.endsWith('@usetroptix.com')) {
      return true;
    }
    return false;
  },
});
