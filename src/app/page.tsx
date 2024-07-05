'use client';
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { motion } from "framer-motion";
import { AlarmClock, Gauge } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from "react";
import { TbTargetArrow } from "react-icons/tb";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardSignature } from "lucide-react";

const Cursor = ({ left, done }: { left?: boolean; done?: boolean }) => {
    return (
        <motion.div
            layoutId="cursor"
            transition={{ duration: 0.11, ease: "linear" }}
            className={classNames("bg-yellow-500 w-0.5 flex absolute h-full top-0", {
                "right-0": !left,
                "left-0": left,
                hidden: done,
            })}
        />
    );
};

const Word = ({ word, inputText, done }: { word: string; inputText: string; done: string; }) => {
    const [isWrong, setWrong] = useState(false);

    useEffect(() => {
        if (done && inputText !== word) {
            setWrong(true);
        } else {
            setWrong(false);
        }
    }, [done, inputText, word]);       //check if current word and input is wrong or right

    return useMemo(() => {
        return (
            <div
                className={classNames("", {
                    relative: inputText != null && inputText.length === 0,      //if  current input is empty
                    "underline decoration-[#ca4754]": isWrong,                //if current input is wrong for word
                })}>
                {word.split("").map((char, i) => {
                    const k = char + i;
                    const wrong = inputText != null && inputText[i] && inputText[i] !== char;
                    return (
                        <span
                            key={k}
                            className={classNames({
                                "text-[#d1d0c5]":
                                    inputText != null && inputText[i] && inputText[i] === char,         //right
                                "text-[#646669]":
                                    done && inputText != null && inputText[i] === undefined,         //leftover
                                "text-[#ca4754]": wrong,                                          //for wrong 
                                relative: inputText != null && inputText.length - 1 === i, //if last letter for cursor
                            })}>
                            {char}
                            {inputText != null && inputText.length - 1 === i && (
                                <Cursor done={!!done} />                               //cursor if last letter 
                            )}
                        </span>
                    );
                })}

                {/* extra letter greater than word */}
                {word.length < inputText?.length && (
                    <span className="text-[#7e2a33] relative opacity-80">
                        {inputText
                            .substring(word.length, inputText.length)
                            .split("")
                            .map((char, i) => {
                                const k = char + i;
                                return <span key={k}>{char}</span>;
                            })}
                        <Cursor done={!!done} />    { /*convert string to boolean */}
                    </span>
                )}
                {inputText != null && inputText.length === 0 && (
                    <Cursor left done={!!done} />
                )}
            </div>
        );
    }, [word, inputText, done, isWrong]);
};

type ProgressProps = {
    name: string;
    accuracy: number;
    speed: number;
};


export default function Home() {
    const [arr, setArr] = useState([false, false, false, false, false, false]);
    const [progress, setProgress] = useState<ProgressProps[]>([{name: "0", accuracy: 0, speed: 0 }]);
    const [usrArr, setUserArr] = useState<string[]>([]);
    const [inputText, setInputText] = useState("");
    const [lastWrong, setLastWrong] = useState(false);
    const [time, setTime] = useState([30, 60, 120, 300]);
    const [gamestart, setGameStart] = useState('not_started');           //not_started running finished 
    const [gamemode, setGameMode] = useState('notime');                   //notime   timed
    const [PastedValue, setPastedValue] = useState("Your Text");
    const [speed, setSpeed] = useState(0);
    const [accurate, setAccurate] = useState(0);
    const [currentms, SetCurrentms] = useState(0);
    const [params, setParams] = useState(12);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);
    const [strArr, setStrArr] = useState("The quick brown fox jumps over the lazy dog. Humanity is the quality of being human; the peculiar nature of man, by which he is distinguished from other beings. It is the characteristic that makes us human and sets us on and appreciation of the intrinsic value of each individual, and of the importance of everyone.".split(" "));
    const router = useRouter();


    async function setData() {
        const response = await fetch('https://random-word-api.vercel.app/api?words=50');
        const data = await response.json();
        setStrArr(data);
        // console.log(data);
    }

    useEffect(() => {
        setLoading(true);
        setData();
        setTimeout(() => {
            setLoading(false);
        }, 1000);

    }, []);

    const handleTimeMode = useCallback(() => {      //called when game is running and in timed mode
        let index: number = arr.indexOf(true);
        console.log(index);
        index -= 2;
        conso

        const runningClock = setInterval(() => {
            const index = arr.indexOf(true);
            setTime((prev) => {
                prev[index - 2] = prev[index - 2] - 0.5;
                if (prev[index - 2] <= 0.5) {
                    setFinished(true);
                    restartGame();
                }
                return prev;
            })
        }, 1000);
        return () => {
            clearInterval(runningClock);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [arr]);

    const calculateAccuracy = useCallback((strArr: Array<string>, usrArr: Array<string>) => {
        const totalLength = usrArr.join('').split('').length;
        let correctLetter = 0;
        for (let i = 0; i < usrArr.length; i++) {
            let str = strArr[i].split('');
            let usr = usrArr[i].split('');
            for (let j = 0; j < usrArr[i].split('').length; j++) {
                if (str[j] === usr[j])
                    correctLetter++;
            }
        }
        let currms = Date.now();
        let elapsedTime = (currms - currentms) / 1000;
        let speed_calc = +((correctLetter * 15) / elapsedTime).toFixed(2);
        setSpeed(speed_calc);

        let accuracy = +((correctLetter / totalLength) * 100).toFixed(2) || 0;
        setAccurate(accuracy);
    }, [currentms]);


    useEffect(() => {
        console.log(gamestart);
        if (gamestart === 'running')
            SetCurrentms(Date.now());

        if (gamestart === 'finished')
            router.push('/');

        if (gamestart === 'running' && gamemode === 'timed')
            handleTimeMode();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gamestart, gamemode, router, handleTimeMode]);


    useEffect(() => {
        if (strArr.length === usrArr.length)
            setGameStart('finished');
    }, [strArr, usrArr]);


    useEffect(() => {
        let interval = setInterval(() => {
            setParams(Math.random());
            calculateAccuracy(strArr, usrArr);
        }, 1000)

        return () => {
            clearInterval(interval);
        }
    }, [calculateAccuracy, router, strArr, usrArr])

    const handleInput = (e: { nativeEvent: { key: any; }; }) => {
        const char = e.nativeEvent.key;

        // console.log(`After`);
        // console.table([inputText, usrArr]);
        if (gamestart === "not_started") {
            setGameStart("running");
            console.log("Game Started");
        }

        if (char === " ") {
            if (inputText?.length > 0) {
                if (strArr[usrArr.length] !== inputText)
                    setLastWrong(true);         //current word is right or wrong
                setUserArr((s2) => {
                    let prevUsrArr = [...s2];
                    prevUsrArr.push(inputText);
                    return prevUsrArr;
                }); //add to usrArr
                setInputText("");
            }
            console.log(`Space Pressed`)
            console.log(`After`);
            if (usrArr.length >= strArr.length - 1){
                setFinished(true);
                restartGame();
            }
            console.table([inputText, usrArr]);
        }
        else if (char.length === 1) {
            setInputText((s) => s + char);
            // console.log(`After`);
            // console.table([inputText, usrArr]);
        }
        else if (char === "Backspace") {
            if (inputText?.length === 0) {
                if (lastWrong && usrArr.length > 0) {
                    let forwarding = usrArr[usrArr.length - 1];
                    setUserArr((u) => u.slice(0, u.length - 1));
                    setLastWrong(false);
                    setInputText(forwarding);
                }
                else {
                    setInputText("");
                }
            }
            else {
                setInputText(inputText.slice(0, inputText.length - 1) || "");
            }
        };
        // console.log(`After`);
        // console.table([inputText, usrArr]);
    }

    function addInputs(punctuations: Array<string>) {
        fetch('https://random-word-api.vercel.app/api?words=40').then((response) => {
            response.json().then((data) => {
                const result = [];
                for (const word of data) {
                    const shouldAddPunctuation = Math.random() < 0.2;
                    if (shouldAddPunctuation) {
                        const punctuationIndex = Math.floor(Math.random() * word.length);
                        const punctuation = punctuations[Math.floor(Math.random() * punctuations.length)];
                        result.push(word.slice(0, punctuationIndex) + punctuation + word.slice(punctuationIndex));
                    } else {
                        result.push(word);
                    }
                }
                setStrArr(result);
            })
        }).catch(Error)
        {
            console.error(Error);
        }
    }

    function handlePunctuation() {
        setLoading(true);
        setUserArr([]);
        setGameMode('notime');
        setGameStart('not_started');
        setInputText('');
        const punctuations = [".", ",", "?", "!", ":", ";", "(", ")", "[", "]", "{", "}", "'", '"', "@", "#", "$", "%"];
        addInputs(punctuations);
        setLoading(false);
    }

    function handleNumber() {
        setLoading(true);
        setUserArr([]);
        setGameMode('notime');
        setGameStart('not_started');
        setInputText('');
        const punctuations = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        addInputs(punctuations);
        setLoading(false);
    }

    function handleTimer(choice: number) {
        restartGame();
        let time: Array<number> = [30, 60, 120, 300];
        let index = Number(choice) - 2;

        setArr(() => {
            let newArr = Array(6).fill(false);
            newArr[choice] = true
            return newArr;
        })
        console.log(time[index]);
        setGameMode('timed');
    }

    function restartGame() {
        setData();
        setInputText("");
        setLastWrong(false);
        setGameStart('not_started');
        setGameMode('notime');
        setUserArr([]);
        setAccurate(0);
        setTime([30, 60, 120, 300]);
        setSpeed(0);
    }

    function handleClipEvent() {
        navigator.clipboard.readText().then((text) => {
            setLoading(true);
            setPastedValue(text);
            restartGame();
            setTimeout(() => {
                setStrArr(text.split(' ').slice(0, 90));
            }, 2000);
            setLoading(false);
        })
    }


    return (
        <>
            {!finished && <div className="mx-12 mt-10">
                <div className="flex justify-between">
                    <span className="flex border border-blue-800 rounded-sm w-fit">

                        <Button variant='ghost' onClick={handlePunctuation}>
                            <div className={classNames('text-xs', 'font-extrabold', { 'text-sky-600': !arr[0], 'text-sky-200': arr[0] })}>@ ! ? :</div>
                        </Button>

                        <Button variant='ghost' className="ml-2" onClick={handleNumber}>
                            <div className={classNames('text-xs', 'font-extrabold', { 'text-sky-600': !arr[1], 'text-sky-200': arr[1] })}>123</div></Button>

                        {params && <div className="flex border border-blue-500 rounded-sm" >
                            <div className="m-2" ><AlarmClock color='red' /></div>

                            <Button variant='ghost' onClick={() => handleTimer(2)}>
                                <div className={classNames('font-bold', { 'text-sky-600': !arr[2], 'text-white': arr[2] })}>{Math.floor(time[0])}
                                </div>
                            </Button>

                            <Button variant='ghost' onClick={() => handleTimer(3)}>
                                <div className={classNames('font-bold', { 'text-sky-600': !arr[3], 'text-white': arr[3] })}>{Math.floor(time[1])}</div></Button>

                            <Button variant='ghost' onClick={() => handleTimer(4)}><div className={classNames('font-extrabold', { 'text-sky-600': !arr[4], 'text-white': arr[4] })}>{Math.floor(time[2])}</div></Button>

                            <Button variant='ghost' onClick={() => handleTimer(5)}><div className={classNames('font-extrabold', { 'text-sky-600': !arr[5], 'text-white': arr[5] })}>{Math.floor(time[3])}</div></Button>

                        </div>}


                        {/* custom Clipboard */}
                        <div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant='ghost'><div className={classNames('font-extrabold', 'text-sky-600')}>Custom</div></Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Custom  Text</DialogTitle>
                                        <DialogDescription>
                                            Paste anything here
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex items-center space-x-2">
                                        <div className="grid flex-1 gap-2">
                                            <Label htmlFor="link" className="sr-only">
                                                Link
                                            </Label>
                                            <Input
                                                id="link"
                                                disabled
                                                value={PastedValue}
                                                readOnly
                                            />
                                        </div>
                                        <Button type="submit" size="sm" className="px-3" onClick={handleClipEvent}>
                                            <ClipboardSignature className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Close
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                    </span>


                    {/* Parameter */}
                    {params && <div className="flex border border-sky-800 rounded-sm w-fit gap-8 pt-2 px-4">

                        <div className="flex">
                            <Gauge color="green" />
                            <span className="text-lg ml-2">{speed}</span>
                            <span className="text-sm">wpm</span>
                        </div>

                        <div className="flex">
                            <TbTargetArrow color="green" size={24} />
                            <span className="text-lg ml-2">{accurate}</span>
                            <span className="text-sm">%</span>
                        </div>

                    </div>}
                </div>

                <div className={classNames('border', 'shadow-md', 'p-6', 'rounded-md', 'flex', 'flex-col', 'gap-6', 'relative', 'm-12', { 'blur-sm': loading })}>
                    {strArr.length === 0 && <div>Loading....</div>}

                    <input
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        data-gramm="false"
                        data-gramm_editor="false"
                        data-enable-grammarly="false"
                        list="autocompleteOff"
                        className="absolute bottom-0 left-0 right-0 -z-10 opacity-0"
                        inputMode="none"
                        value={inputText}
                        onKeyUp={handleInput}
                        onChange={() => { console.log({ inputText }) }}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        onBlur={(e) => e?.target?.focus()}
                    />

                    <div className="flex gap-2 flex-wrap font-roboto_mono text-gray-500 tracking-wider text-xl">
                        {strArr.map((word, i) => {
                            const k = word + i;
                            return (
                                <Word
                                    key={k}
                                    word={word}
                                    inputText={usrArr.length === i ? inputText : usrArr[i]}
                                    done={usrArr[i]}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>}

            {finished && <div>{JSON.stringify(progress)}</div>}
        </>
    )
}