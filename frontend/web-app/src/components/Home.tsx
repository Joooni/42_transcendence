type GreetProps = {
	name: string
}

export const Home = (props: GreetProps) => {
	return (
	  <div className="Home">
		<p>
			WELCOME {props.name}! YOU STILL HAVE A LOT TO LEARN!
		</p>
		<div className="Button">
			JOIN A NEW GAME
		</div>
	  </div>
	);
  }

export default Home;