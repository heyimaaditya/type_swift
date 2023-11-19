import { Button } from "./ui/button";

function HeroSection() {
    return (
        <div className='text-white mt-40 ml-20 font-serif'>
            <div className="text-6xl w-2/4">
                <div className="my-8">Everyone has a </div>
                <div className="my-8">keyboard </div>
                <div className="my-8">to type on</div>
            </div>

            <div className="font-serif text-2xl">Practise it in One Arena.
            <span><Button variant="outline" className="text-black font-serif text-xl ml-3">Join Now</Button></span></div>
        </div>
    )
}

export default HeroSection;