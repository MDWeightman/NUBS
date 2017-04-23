class _Screen{
	constructor(){
		this.current = null;
	}

	set(screen){
		this.current = screen;
		this.draw();
	}

	draw(){
		this.current.draw();
	}
}