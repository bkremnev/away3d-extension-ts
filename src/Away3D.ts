/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
///<reference path="def/webgl.d.ts"/>
///<reference path="away/events/AwayEvent.ts" />
///<reference path="away/events/EventDispatcher.ts" />

///<reference path="away/display3D/Stage3D.ts" />
///<reference path="away/display3D/Context3D.ts" />
///<reference path="away/display3D/Program3D.ts" />
///<reference path="away/display3D/VertexBuffer3D.ts" />
///<reference path="away/display3D/IndexBuffer3D.ts" />
///<reference path="away/display3D/Texture.ts" />
///<reference path="away/display3D/Context3DTextureFormat.ts" />
///<reference path="away/display3D/Context3DVertexBufferFormat.ts"/>

var GL:WebGLRenderingContext = null;

class Away3D extends away.events.EventDispatcher
{
	
	private _stage3D:away.display3D.Stage3D;
	
	constructor(canvas:HTMLCanvasElement = null)
	{
		super();
		
		if( !canvas )
		{
			canvas = document.createElement( "canvas" );
			document.body.appendChild( canvas );
		}
		
		this._stage3D = new away.display3D.Stage3D( canvas );
		this._stage3D.addEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
		this._stage3D.requestContext();
	}
	
	private onContext3DCreateHandler( e )
	{
		
		this._stage3D.removeEventListener( away.events.AwayEvent.CONTEXT3D_CREATE, this.onContext3DCreateHandler, this );
		
		// test
		var stage3D: away.display3D.Stage3D = <away.display3D.Stage3D> e.target;
		var context3D: away.display3D.Context3D = stage3D.context3D;
		
		//context3D.createTexture( 512, 512, away.display3D.Context3DTextureFormat.BGRA, true );
		
		context3D.configureBackBuffer( 800, 600, 0, true );
		context3D.setColorMask( true, true, true, true ); 
		
		var vertices:number[] = [
							 0.0,  1.0,  0.0,
							-1.0, -1.0,  0.0,
							 1.0, -1.0,  0.0
							];
		
		var indices:number[] = [
							0, 1, 2,
							0, 2, 3
							]
		
		var vBuffer: away.display3D.VertexBuffer3D = context3D.createVertexBuffer( 3, 3 );
		vBuffer.upload( vertices, 0, 3 );
		
		var iBuffer: away.display3D.IndexBuffer3D = context3D.createIndexBuffer( 6 );
		iBuffer.upload( indices, 0, 6 );
		
		var program:away.display3D.Program3D = context3D.createProgram();
		
		var vProgram:string = "attribute vec3 aVertexPosition;\n" +
							  "void main() {\n" +
							  "		gl_Position = vec4(aVertexPosition,1.0);\n" +
							  "}\n";
		
		var fProgram:string = "void main() {\n" +
							  "		gl_FragColor = vec4(0.3,0.6,0.9,1);\n" +
							  "}\n";
		
		program.upload( vProgram, fProgram );
		context3D.setProgram( program );
		
		
		var matrix:away.geom.Matrix3D = new away.geom.Matrix3D();
		
		context3D.setGLSLVertexBufferAt( "aVertexPosition", vBuffer, 0, away.display3D.Context3DVertexBufferFormat.FLOAT_3 );
		
		context3D.clear( 0.9, 0.6, 0.3, 1 );
		context3D.drawTriangles( iBuffer, 0, 1 );
		context3D.present();
		
	}
}