import { Button } from "./button";
import Logo from "./logo";

const Navigation = () => {
  return (
    <nav className="shadow-lg p-5">
      <div className="container m-auto flex justify-between">
        <Logo />
        <Button size='lg'>
          Criar campanha agora
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
