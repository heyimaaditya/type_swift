'use client';
import React, { useRef, useState, useEffect, useMemo, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Gauge } from 'lucide-react';
import { Input } from '@/components/ui/input';
import classNames from "classnames";
import { motion } from "framer-motion";
import { TbTargetArrow } from 'react-icons/tb';
import { useRouter } from 'next/navigation'

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


const Dictate = () => {
    const router = useRouter();

    let para =
        "All smiles, I know what it takes to fool this town I'll do it 'til the sun goes down And all through the nighttime Oh, yeah Oh, yeah, I'll tell you what you wanna hear Leave my sunglasses on while I shed a tear It's never the right time Yeah, yeah I put my armor on, show you how strong I am I put my armor on, I'll show you that I am I'm unstoppable I'm a Porsche with no brakes I'm invincible Yeah, I win every single game I'm so powerful I don't need batteries to play I'm so confident Yeah, I'm unstoppable today Unstoppable today Unstoppable today Unstoppable today I'm unstoppable today Break down, only alone I will cry out loud You'll never see what's hiding out Hiding out deep down Yeah, yeah I know, I've heard that to let your feelings show Is the only way to make friendships grow But I'm too afraid now Yeah, yeah I put my armor on, show you how strong I am I put my armor on, I'll show you that I am I'm unstoppable I'm a Porsche with no brakes I'm invincible Yeah, I win every single game I'm so powerful I don't need batteries to play I'm so confident Yeah, I'm unstoppable today Unstoppable today Unstoppable today Unstoppable today I'm unstoppable today Unstoppable today Unstoppable today Unstoppable today I'm unstoppable today I put my armor on, show you how strong I am I put my armor on, I'll show you that I am I'm unstoppable I'm a Porsche with no brakes I'm invincible Yeah, I win every single game I'm so powerful I don't need batteries to play I'm so confident Yeah, I'm unstoppable today Unstoppable today Unstoppable today Unstoppable today I'm unstoppable today Unstoppable today Unstoppable today Unstoppable today I'm unstoppable today".split(" ").slice(0, 100);

    const [usrArr, setUserArr] = useState<string[]>([]);
    const [inputText, setInputText] = useState("");
    const [lastWrong, setLastWrong] = useState(false);
    const [strArr, setStrArr] = useState(para);

    const handleInput = (e: KeyboardEvent<HTMLInputElement>) => {
        const char = e.nativeEvent.key;

        // console.log(`After`);
        // console.table([inputText, usrArr]);

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


    const audioRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState('0');
    const [time, setTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [songName, setSongName] = useState('Unstoppable by Sia');
    const [data, setData] = useState(null);
    const [songRes, setSongRes] = useState('unstoppable');
    const [loading, setLoading] = useState(true);
    const [imageLink, setImageLink] = useState(null);
    const [SongNameRes, setSongNameRes] = useState('Unstoppable');
    const [songId, setSongId] = useState("t5e4VTsk");


    const [startTime, setStartTime] = useState(0);
    const [gameStat, setGameStat] = useState('stopped');                 //running, stopped
    const [accurate, setAccurate] = useState(0);
    const [speed, setSpeed] = useState(0);

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://saavn.me/search/songs?query=${songRes}&page=1&limit=1`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
                console.log(result);
                setImageLink(result['data']['results'][0]['image'][2]['link']);
                setSongNameRes(result['data']['results'][0]['name']);
                setLoading(false);
                return result;
        }
            catch (error) {
                console.error(error);
            }
            
        };

    useEffect(() => {
        fetchData();
        const handleTimeUpdate = () => {
            let temp:string = audioRef.current.currentTime+'a'
            let temp1:string = temp.split('.')[0];
            setCurrentTime(temp1);
            setTime(Date.now());
        };

        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []); 

    useEffect(()=>{
        calculateAccuracy(strArr, usrArr);
        // if(strArr.length === usrArr.length && gameStat==='running')
            // router.push('/');
    }, [calculateAccuracy, strArr, usrArr]);

    const playAudio = () => {
        if(gameStat === 'stopped')
        {
            setStartTime(Date.now());
            setGameStat('running');
        }

        audioRef.current.play();
        setIsPaused(!isPaused);
    };

    const pauseAudio = () => {
        audioRef.current.pause();
        setIsPaused(!isPaused);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };


    async function handleClick101(){
        setLoading(true);
        resetGame();
        fetchData().then((data)=>{
            let temp = data!['data']['results']['id'];
                setSongId(temp);
            
        }).catch((error)=>{
            console.error(error);
        });

        try{
            const response = await fetch(`https://saavn.me/lyrics?id=${songId}`);
            let temp = await response.json();
            let lyrics = temp['data']['lyrics'];
            setStrArr(lyrics);
        }
        catch(error)
        {
            console.log(error);
        }
    }


    function resetGame(){
        setIsPaused(false);
        setData(null);
        setGameStat('stopped');
        setUserArr("".split(""));
        setInputText("");
        setLastWrong(false);
        setStrArr("".split(""))
    }

    function calculateAccuracy(strArr: Array<string>, usrArr: Array<string>) {
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
        let elapsedTime = (currms - startTime) / 1000;
        let speed_calc = +((correctLetter * 15) / elapsedTime).toFixed(2);
        setSpeed(speed_calc);

        let accuracy = +((correctLetter / totalLength) * 100).toFixed(2) || 0;
        setAccurate(accuracy);
    }

    return (
        <div className='bg-slate-950 h-screen w-screen'>
        

            <div className='hidden'>
            {songId && <audio ref={audioRef} controls onLoadedMetadata={handleLoadedMetadata}>
                <source src='https://aac.saavncdn.com/552/26b33054461788c6282e4ac814d3769f_320.mp4' type="audio/mp3" />
            </audio>}
            </div>




            
            {/* song Description */}
            <div className='p-20 bg-slate-950'>    
            <div className='p-0 flex flex-row justify-center align-middle'>


                <div className="basis-1/4 mr-8 mt-20">
                    <Input
                        type="string"
                        placeholder="SongName"
                        value={songName}
                        onChange={(event) => {
                            setSongName(event.target.value);
                            setSongRes(event.target.value.replace(/ /g, '+'))
                        }}
                    />
                    <Button className="mt-4" type="submit" onClick={()=>{handleClick101()}}>Type on it</Button>
                </div>


                <div className='image'>
                <img src={imageLink} alt="Album Cover" style={{ width: '200px', height: '200px', objectFit: 'contain'}} />
                </div>
                
                <div className='description ml-5'>
                        <div className='text-white'>Name: <span className='text-green-400'>{SongNameRes}</span></div>
                        <div className='text-white'>Artist: <span className='text-green-400'>{data && data['data']['results'][0]['primaryArtists']}</span></div>
                        <div className='text-white'>Playcount: <span className='text-green-400'>{data && data['data']['results'][0]['playCount']}</span></div>
                        <div className='text-white'>Year: <span className='text-green-400'>{data && data['data']['results'][0]['year']}</span></div>

                        <div className='text-primary text-lg'>
                            Current Time: {currentTime} seconds
                            {/* Duration: {duration};
                            Time: {time} seconds */}
                        </div>

                        {!loading && <div>
                            {!isPaused && <Button variant="outline" size="icon" onClick={playAudio} className='bg-slate-950 text-primary border-primary'>
                                <Play />
                            </Button>}

                            {isPaused && <Button variant="outline" size="icon" onClick={pauseAudio} className='bg-slate-950 text-primary border-primary'>
                                <Pause />
                            </Button>}
                        </div>}

                        <div className="flex border border-sky-800 rounded-sm w-min p-2 ml-52">
                            <div className="flex"><Gauge color="green" /><span className="text-lg text-white pl-3">{speed}</span><span className="text-slate-200 text-sm ml-1">wpm</span></div>
                            <div className="text-green-400 text-2xl ml-3  flex"><TbTargetArrow /><span className="text-white ml-1">{accurate}</span><span className="text-slate-200 text-sm ml-1">%</span></div>
                        </div>
                </div>
            </div>
            </div>


            {isPaused && <div className='m-4 p-4'>
                <div className="flex justify-center items-center h-full">
                    <div className="border shadow-md p-6 rounded-md flex flex-col gap-6 relative w-full bg-black">
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
            </div>}

            {!isPaused && <div className='m-4 p-4 text-2xl ml-64'><h3>Play Song to type.</h3></div>}


        </div>
    );
};

export default Dictate;

