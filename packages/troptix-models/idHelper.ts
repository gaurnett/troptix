import ShortUniqueId from 'short-unique-id';

export function generateId() {
  const uid = new ShortUniqueId({
    dictionary: 'alphanum_upper',
    length: 12
  });

  return uid.rnd();
}