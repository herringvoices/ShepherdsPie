function Welcome({ loggedInUser }) {
  return (
    <div>
      <h1 className="mt-2">Welcome, {loggedInUser.firstName}!</h1>

      <p>
        We're so happy to have you working as a part of our Shepherd's Pie
        family!
      </p>
      <p>Use the navigation bar above to move about the site!</p>
    </div>
  );
}
export default Welcome;
