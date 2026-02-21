export const setUserGuestId = (owner: { userId?: any; guestId?: any }) => {
  let { userId, guestId } = owner;

  if (!userId) userId = null;
  if (!guestId) guestId = null;

  return { userId, guestId };
};
