'use client';
import classNames from "classnames";
import { motion } from "framer-motion";
import { KeyboardEvent, useEffect, useMemo, useState } from "react";

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

const WordPallete = () => {
    const strArr =
        "The quick brown box jumps over the lazy dog. Humanity is the quality of being human; the peculiar nature of man, by which he is distinguished from other beings. It is the characteristic that makes us human and sets us on and appreciation of the intrinsic value of each individual, and of the importance of everyone’s contribution to society. Humanity is an essential part of all of us , and it is important to remember that we are all part of a larger collective of humanity. Without it, we would not be able to live in harmony with one another or the planet. Humanity is something that is essential to our existence and to our survival as a species, and it is something that we must work to cultivate and protect.".split(" ");

    const [usrArr, setUserArr] = useState<string[]>([]);
    const [inputText, setInputText] = useState("");
    const [lastWrong, setLastWrong] = useState(false);

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


    return (
        <div className="flex justify-center items-center h-full">
            <div className="border border-slate-600 shadow-md p-6 rounded-md flex flex-col gap-6 relative w-full bg-[#2c2e31]">
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

                <div className="flex gap-2 flex-wrap max-w-[80vw] font-roboto_mono text-[#646669] tracking-wider text-xl">
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
    );
};


export default WordPallete;