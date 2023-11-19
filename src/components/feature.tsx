import Image from "next/image";
import image from "../../public/book.jpg";
import solo from '../../public/solo.png'
import friend from '../../public/friends.png'

function Feature() {
    return (
        <section className="container mx-auto px-4 space-y-6  py-8 dark:bg-transparent md:py-12 lg:py-20">

            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Features</h2>
            </div>

            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                <div
                    className="relative overflow-hidden rounded-lg border  select-none hover:shadow hover:shadow-teal-200 p-2">
                    <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                        <Image
                            alt="Background image"
                            src={image}
                            // height={60}
                            width={50}
                            className="object-cover ">
                        </Image>
                        <div className="space-y-2">
                            <h3 className="font-bold">Typing Lession</h3>
                            <p className="text-sm text-muted-foreground hover:text-white">Customized Typing Lession for begineer, Novice.</p>
                        </div>
                    </div>
                </div>

                <div
                    className="relative overflow-hidden rounded-lg border  select-none hover:shadow hover:shadow-teal-200 p-2">
                    <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                        <Image
                            alt="Background image"
                            src={solo}
                            // height={60}
                            width={50}
                            className="object-cover ">
                        </Image>
                        <div className="space-y-2">
                            <h3 className="font-bold ">Solo Arena</h3>
                            <p className="text-sm hover:text-white text-muted-foreground">Type along customized length, time Paragraph.</p>
                        </div>
                    </div>
                </div>

                <div
                    className="relative overflow-hidden rounded-lg border select-none hover:shadow hover:shadow-teal-200 p-2">
                    <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                        <Image
                            alt="Background image"
                            src={friend}
                            // height={60}
                            width={50}
                            className="object-cover ">
                        </Image>
                        <div className="space-y-2">
                            <h3 className="font-bold">Friends & Globe</h3>
                            <p className="text-sm text-muted-foreground hover:text-white">Challenge your friends circle in Arena.</p>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    )
}

export default Feature;