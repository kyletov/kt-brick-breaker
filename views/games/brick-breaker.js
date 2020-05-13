<script type="text/babel">
	class GameCanvas extends React.Component {
		constructor(props) {
			super(props);
		}
		render(props){
			return (
				<canvas id="stage" width="800" height="800" style={{border:"1px solid black"}} />
			);
		}
	}

	class ViewComponent extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				"currentState": true,
			}
			this.clickHandler = this.clickHandler.bind(this);
		}

		clickHandler(e) {
			// Do something
		}

		render() {
			return (
				<h1>Welcome to KT Brick Breaker!</h1>
				<GameCanvas />
			);
		}
	}

	ReactDOM.render( <ViewComponent />,
    document.getElementById('root')
  );
</script>