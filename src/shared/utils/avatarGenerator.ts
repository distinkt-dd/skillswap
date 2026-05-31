const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'identicon',
  'micah',
  'lorelei',
  'open-peeps',
  'personas',
  'shapes',
  'pixel-art',
] as const;

export const generateRandomAvatar = (seed?: string): string => {
  const randomSeed = seed || Math.random().toString(36).substring(2, 10);
  const randomStyle = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];

  return `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${randomSeed}`;
};
