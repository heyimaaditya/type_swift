'use client';
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";
import { AlarmClock } from 'lucide-react';
import { Gauge } from 'lucide-react';
import { TbTargetArrow } from "react-icons/tb";
import { useRouter } from 'next/navigation';


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
                                    done && inputText != null && inputText[i] === undefined,           //leftover
                                "text-[#ca4754]": wrong,                                            //for wrong 
                                relative: inputText != null && inputText.length - 1 === i,           //if last letter for cursor
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

export default function Random() {
    const router = useRouter();

        // let arr = [false, false, false, false, false, false, false];

        const [loading, setLoading] = useState(true);
        const [strArr, setStrArr] = useState("The quick brown fox jumps over the lazy dog. Humanity is the quality of being human; the peculiar nature of man, by which he is distinguished from other beings. It is the characteristic that makes us human and sets us on and appreciation of the intrinsic value of each individual, and of the importance of everyone’s.".split(" "));

        async function setData(){
            const response = await fetch('https://random-word-api.vercel.app/api?words=40');
            const data = await response.json();
            setStrArr(data);
            // console.log(data);
        }

        useEffect( ()=>{
            setLoading(true);
            setData();
            setTimeout(()=>{
                setLoading(false);
            }, 1000);
            
        }, []);

    const [arr, setArr] = useState([false, false, false, false, false, false, false]);
    const [usrArr, setUserArr] = useState<string[]>([]);
    const [inputText, setInputText] = useState("");
    const [lastWrong, setLastWrong] = useState(false);
    const [time, setTime] = useState([30, 60, 120, 300]);
    const [gamestart, setGameStart] = useState('not_started');           //not_started running finished 
    const [gamemode, setGameMode] = useState('notime');                   //notime   timed
    const [showDiv, setShowDiv] = useState(1);
    const [runClock, SetRunClock] = useState(null);

    const [speed, setSpeed] = useState(0);
    const [accurate, setAccurate] = useState(0);
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowDiv(prevState => prevState+1);
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(()=>{
        console.log(gamestart);
        if(gamestart === 'finished')
            router.push('/');

        if(gamestart === 'running' && gamemode === 'timed')
            handleTimeMode();

        if (gamestart === 'not_started')
            clearInterval(runClock!);
    }, [gamestart, gamemode]);

    function handleTimeMode(){      //called when game is running and in timed mode
        let index: number = arr.indexOf(true);
        console.log(index);
        index-=2;

        const runningClock = setInterval(()=>{
            const index = arr.indexOf(true);
            setTime((prev) => {
                prev[index - 2] = prev[index-2]-0.5;
                if(prev[index-2]===0.5)
                    setGameStart('finished');
                return prev;
            })
        }, 1000);
        SetRunClock(runningClock);
    }


    const handleInput = (e: KeyboardEvent<HTMLInputElement>) => {
        const char = e.nativeEvent.key;

        // console.log(`After`);
        // console.table([inputText, usrArr]);
        if(gamestart === "not_started")
        {
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

    function addInputs(punctuations: Array<string>){
        fetch('https://random-word-api.vercel.app/api?words=40').then((response)=>{
            response.json().then((data)=>{
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

    function handlePunctuation(){
        setLoading(true);
        setUserArr([]);
        setGameMode('notime');
        setGameStart('not_started');
        setInputText('');
        const punctuations = [".", ",", "?", "!", ":", ";", "(", ")", "[", "]", "{", "}", "'", '"', "@", "#", "$", "%"];
        addInputs(punctuations);
        setLoading(false);
    }

    function handleNumber(){
        setLoading(true);
        setUserArr([]);
        setGameMode('notime');
        setGameStart('not_started');
        setInputText('');
        const punctuations = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        addInputs(punctuations);
        setLoading(false);
    }

    function handleTimer(choice: number){
        restartGame();
        let time:Array<number> = [30, 60, 120, 300]; 
        let index = Number(choice) - 2;

        setArr(()=>{
            let newArr = Array(6).fill(false);
            newArr[choice]=true
            return newArr;
        })
        console.log(time[index]);
        setGameMode('timed');
    }

    function restartGame(){
        setData();
        setInputText("");
        setLastWrong(false);
        setGameStart('not_started');
        setGameMode('notime');
        setUserArr([]);
        setSpeed(0);
        setAccurate(0);
        setTime([30, 60, 120, 300]);
    }

    return (
        <div className="h-screen bg-black absolute">
        <div className="options mt-10 flex w-min">
            <span className="flex border border-sky-800 rounded-sm flex-auto w-min ml-96">
                    <div><Button variant='ghost' onClick={handlePunctuation}><div className={classNames('text-xs', 'font-extrabold', { 'text-sky-600': !arr[0], 'text-sky-200': arr[0] })}>@ ! ? :</div></Button></div>

                    <div><Button variant='ghost' className="ml-2" onClick={handleNumber}><div className={classNames('text-xs', 'font-extrabold', { 'text-sky-600': !arr[1], 'text-sky-200': arr[1] })}>123</div></Button></div>

                    { showDiv && <div className="flex border rounded-sm ml-2" >
                        <div className="m-2" ><AlarmClock color='red' /></div>

                        <Button variant='ghost' onClick={()=>handleTimer(2)}><div className={classNames('font-extrabold', { 'text-sky-600': !arr[2], 'text-white':arr[2], 'text-xl': arr[2]})}>{time[0]}</div></Button>

                        <Button variant='ghost' onClick={() => handleTimer(3)}><div className={classNames('font-extrabold', { 'text-sky-600': !arr[3], 'text-white': arr[3], 'text-xl': arr[3] })}>{time[1]}</div></Button>

                        <Button variant='ghost' onClick={() => handleTimer(4)}><div className={classNames('font-extrabold', { 'text-sky-600': !arr[4], 'text-white': arr[4], 'text-xl': arr[4] })}>{time[2]}</div></Button>

                        <Button variant='ghost' onClick={() => handleTimer(5)}><div className={classNames('font-extrabold', { 'text-sky-600': !arr[5], 'text-white': arr[5], 'text-xl': arr[5] })}>{time[3]}</div></Button>
                    </div>}

                    <div>
                        <Button variant='ghost' className="ml-2"><div className={classNames('text-sm', 'font-extrabold', { 'text-sky-600': !arr[6], 'text-sky-200': arr[6] })}>custom</div></Button>
                    </div>
                </span>

                    <span className="flex border border-sky-800 rounded-sm w-min p-2 ml-72">
                        <div className="flex"><Gauge color="green" /><span className="text-lg text-white pl-3">{speed}</span><span className="text-slate-200 text-sm ml-1">wpm</span></div>
                        <div className="text-green-400 text-2xl ml-3  flex"><TbTargetArrow /><span className="text-white ml-1">{accurate}</span><span className="text-slate-200 text-sm ml-1">%</span></div>
                    </span>
        </div>

            <div className={classNames('border', 'shadow-md', 'p-6', 'rounded-md', 'flex', 'flex-col', 'gap-6', 'relative', 'm-12', {'blur-sm': loading})}>
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
                        onChange={() => { }}
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

        </div>
    )
}