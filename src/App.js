import React from "react";
import { useEffect, useState } from "react";
import { interval, Subject } from "rxjs";
import {
  filter,
  map,
  pairwise,
  takeUntil,
} from "rxjs/operators";

import './App.css'

const parseTime = (seconds) => {
  return new Date(seconds).toISOString().slice(11, 19)
}

const doubleClick$ = new Subject().pipe(
  map(() => new Date().getTime()),
  pairwise(),
  filter((timestamps) => timestamps[0] > new Date().getTime() - 200)
)

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [isCounting, setIsCounting] = useState(false)

  useEffect(() => {
    const sub = doubleClick$.subscribe(() => {
      setIsCounting(false)
    })
    return () => {
      sub.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(
        takeUntil(unsubscribe$)
      )
      .subscribe(() => {
        if (isCounting) {
          setSeconds(prev => prev + 1000)
        }
      })
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [isCounting])

  const start = () => {
    setIsCounting(true)
  }

  const stop = () => {
    setIsCounting(false)
    setSeconds(0)
  }

  const reset = () => {
    setSeconds(0)
    setIsCounting(true)
  }

  const wait = () => {
    doubleClick$.next()
  }

  return (
    <div className='stopwatch'>
      <span className='time'>{parseTime(seconds)}</span>
      <div>
        <button className="button" onClick={start}>Start</button>
        <button className="button" onClick={stop}>Stop</button>
        <button className="button" onClick={reset}>Reset</button>
        <button className="button" onClick={wait}>Wait</button>
      </div>
    </div>
  );
}
