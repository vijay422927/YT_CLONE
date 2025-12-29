class Apierror extends Error{
    constructor(statusCode,message="some thing went wrong")
    {
        super(message);
        this.statusCode=statusCode;
        this.message=message;
        this.data=null;
        this.success=false; 
    }
}
export  {Apierror};