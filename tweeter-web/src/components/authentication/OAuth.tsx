import OAuthButtons from "./OAuthButtons";

const OAuth = () => {
  return (
    <div className="text-center mb-3">
      <OAuthButtons provider="google" />
      <OAuthButtons provider="facebook" />
      <OAuthButtons provider="twitter" />
      <OAuthButtons provider="linkedin" />
      <OAuthButtons provider="github" />
    </div>
  );
};

export default OAuth;
