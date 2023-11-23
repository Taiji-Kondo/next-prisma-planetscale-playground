'use client';

import { prisma, Process, Roast, CoffeeBean } from '@/libs/prisma/prismaClient';
import { useEffect, useReducer, useState } from 'react';
import { CreateCoffeeBeanRequestType } from '@/app/api/coffee-bean/route';

type CoffeeBeanEditFromType = {
  name: string;
  origin?: string;
  variety?: string;
  process?: number;
  roast?: number;
  rating?: number;
  note?: string;
  purchaseDate?: string;
};

export default function CoffeeBeanEditPage({ params: { coffeeBeanId } }: { params: { coffeeBeanId: string } }) {
  // TODO: get auth user
  const userId = 2;

  const [{ processes, roasts }, setMasters] = useState<{ processes: Process[]; roasts: Roast[] }>({
    processes: [],
    roasts: [],
  });
  const [form, setForm] = useState<CoffeeBeanEditFromType>({
    name: '',
    origin: undefined,
    variety: undefined,
    process: undefined,
    roast: undefined,
    rating: undefined,
    note: undefined,
    purchaseDate: undefined,
  });

  const handleChange = ({ key, value }: { key: keyof CoffeeBeanEditFromType; value: any }) => {
    setForm((state) => ({ ...state, [key]: value }));
  };

  useEffect(() => {
    (async () => {
      try {
        const coffeeBeanResponse = await fetch(`/api/coffee-bean?userId=${userId}&coffeeBeanId=${coffeeBeanId}`);
        const { body: coffeeBeanBody } = await coffeeBeanResponse.json();
        if (!coffeeBeanBody) return;
        setForm(coffeeBeanBody.coffeeBean);

        const processesResponse = await fetch('/api/processes');
        const roastsResponse = await fetch('/api/roasts');
        const { body: processesBody } = await processesResponse.json();
        const { body: roastsBody } = await roastsResponse.json();
        if (!processesBody || !roastsBody) return;

        setMasters({ processes: processesBody.processes, roasts: roastsBody.roasts });
      } catch (error) {
        console.error(`Failed to get master data: ${error}`);
      }
    })();
  }, [coffeeBeanId]);

  const handleSubmit = async () => {
    try {
      const requestBody = {
        userId,
        name: form.name,
        origin: form.origin,
        variety: form.variety,
        processId: form.process,
        roastId: form.roast,
        rating: form.rating,
        note: form.note,
        purchaseDate: form.purchaseDate,
      } satisfies CreateCoffeeBeanRequestType;

      const response = await fetch('/api/coffee-bean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const { body } = await response.json();
      console.log(body);
    } catch (error) {
      console.error(`Failed to add coffee bean: ${error}`);
    }
  };

  return (
    <main className={'px-4'}>
      <h1 className={'text-xl font-bold'}>Coffee Bean Edit</h1>

      <section>
        <form>
          <div>
            <label htmlFor="name">名前: </label>
            <input
              className={'text-black'}
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'name', value });
              }}
            />
          </div>
          <div>
            <label htmlFor="origin">原産国: </label>
            <input
              className={'text-black'}
              type="text"
              id="origin"
              name="origin"
              value={form.origin}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'origin', value });
              }}
            />
          </div>
          <div>
            <label htmlFor="variety">品種: </label>
            <input
              className={'text-black'}
              type="text"
              id="variety"
              name="variety"
              value={form.variety}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'variety', value });
              }}
            />
          </div>
          <div>
            <label htmlFor="process">精製方法: </label>
            <select
              className={'text-black'}
              id={'process'}
              name={'process'}
              value={form.process}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'process', value: Number(value) });
              }}
            >
              {processes.map(({ processId, name }) => (
                <option key={processId} value={processId}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="roast">焙煎度: </label>
            <select
              className={'text-black'}
              id={'roast'}
              name={'roast'}
              value={form.roast}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'roast', value: Number(value) });
              }}
            >
              {roasts.map(({ roastId, name }) => (
                <option key={roastId} value={roastId}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rating">評価: </label>
            <select
              className={'text-black'}
              name="rating"
              id="rating"
              value={form.rating}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'rating', value: Number(value) });
              }}
            >
              <option value="1">★</option>
              <option value="2">★★</option>
              <option value="3">★★★</option>
              <option value="4">★★★★</option>
              <option value="5">★★★★★</option>
            </select>
          </div>
          <div>
            <label htmlFor="note">メモ: </label>
            <textarea
              className={'text-black'}
              id="note"
              name="note"
              value={form.note}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'note', value });
              }}
            />
          </div>
          <div>
            <label htmlFor="purchaseDate">購入日: </label>
            <input
              className={'text-black'}
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={form.purchaseDate}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'purchaseDate', value });
              }}
            />
          </div>
          <button type="button" onClick={handleSubmit}>
            送信
          </button>
        </form>
      </section>
    </main>
  );
}