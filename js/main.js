
	/**
	 * @module UP
	 * @submodule Main
	 * @class Main
	 */
	function main() {
	
		/**
		 * The App Delegate which acts like a orchestra conductor
		 * @property recommender
		 * @type Recommender
		 * @default "new Recommender()"
		 */
		this.recommender = new UP.Recommender();
		
		/**
		 * The App Delegate Controller
		 * @property facadeController
		 * @type FacadeController
		 * @default "new FacadeController(window, recommender)"
		 */
		this.facadeController = new UP.FacadeController(window, recommender);
	}

	// Starting out the system
	main();