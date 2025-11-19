import HaloAbout from "./About";
import HaloAboutGrid from "./HaloAboutGrid";
import backgroundImage from "../assets/background.jpg";

interface HaloAboutPageProps {
  onSignIn: () => void;
}

const HaloAboutPage = ({ onSignIn }: HaloAboutPageProps) => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <HaloAbout onSignIn={onSignIn} />
      <HaloAboutGrid />
    </div>
  );
};

export default HaloAboutPage;
