export const badgeCount = [
  1, 25, 50, 100,
  // Test
  2, 3, 4, 5,
];

export const generateMessage = (count, game) => {
  const message = `Badge for playing ${game} ${count} times`;
  return message;
};
