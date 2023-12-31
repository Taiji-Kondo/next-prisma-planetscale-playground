'use client';

import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DeleteCoffeeBeanRequestType, PutCoffeeBeanRequestType } from '@/app/api/coffee-bean/route';
import { Process, Roast } from '@/libs/prisma/prismaClient';

type CoffeeBeanEditFromType = {
  name: string;
  note?: string;
  origin?: string;
  process?: number;
  purchaseDate?: string;
  rating?: number;
  roast?: number;
  variety?: string;
};

export default function CoffeeBeanEditPage({ params: { coffeeBeanId } }: { params: { coffeeBeanId: string } }) {
  // TODO: get auth user
  const userId = 2;

  const router = useRouter();

  const [isSetup, setIsSetup] = useState(false);
  const [{ processes, roasts }, setMasters] = useState<{ processes: Process[]; roasts: Roast[] }>({
    processes: [],
    roasts: [],
  });
  const [form, setForm] = useState<CoffeeBeanEditFromType>({
    name: '',
    note: undefined,
    origin: undefined,
    process: undefined,
    purchaseDate: undefined,
    rating: undefined,
    roast: undefined,
    variety: undefined,
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
        setForm({
          ...coffeeBeanBody.coffeeBean,
          process: coffeeBeanBody.coffeeBean.process.processId,
          roast: coffeeBeanBody.coffeeBean.roast.roastId,
        });

        const processesResponse = await fetch('/api/processes');
        const roastsResponse = await fetch('/api/roasts');
        const { body: processesBody } = await processesResponse.json();
        const { body: roastsBody } = await roastsResponse.json();
        if (!processesBody || !roastsBody) return;

        setMasters({ processes: processesBody.processes, roasts: roastsBody.roasts });
        setIsSetup(true);
      } catch (error) {
        console.error(`Failed to get master data: ${error}`);
      }
    })();
  }, [coffeeBeanId]);

  const handleSubmit = async () => {
    try {
      const requestBody = {
        coffeeBeanId: Number(coffeeBeanId),
        name: form.name,
        note: form.note,
        origin: form.origin,
        processId: form.process,
        purchaseDate: form.purchaseDate,
        rating: form.rating,
        roastId: form.roast,
        userId,
        variety: form.variety,
      } satisfies PutCoffeeBeanRequestType;

      const response = await fetch('/api/coffee-bean', {
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      });
      const { body } = await response.json();
      console.log(body);
    } catch (error) {
      console.error(`Failed to update coffee bean: ${error}`);
    }
  };

  const [isDeleteReady, setIsDeleteReady] = useState(false);
  const handleDelete = async () => {
    setIsDeleteReady(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const requestBody = {
        coffeeBeanId: Number(coffeeBeanId),
      } satisfies DeleteCoffeeBeanRequestType;

      const response = await fetch('/api/coffee-bean', {
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
      const { body } = await response.json();
      console.log(body);
      router.replace('/coffee-bean');
    } catch (error) {
      console.error(`Failed to delete coffee bean: ${error}`);
    }
  };

  if (!isSetup) return <p>Loading...</p>;

  return (
    <>
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
              {processes.map(({ name, processId }) => (
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
              {roasts.map(({ name, roastId }) => (
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
              value={form.purchaseDate ? format(new Date(form.purchaseDate), 'yyyy-MM-dd') : undefined}
              onChange={(event) => {
                const value = event.currentTarget.value;
                handleChange({ key: 'purchaseDate', value });
              }}
            />
          </div>
          <button className={'block'} type="button" onClick={handleSubmit}>
            送信
          </button>
          <button className={'block'} type="button" onClick={handleDelete}>
            削除
          </button>
          {isDeleteReady && (
            <div>
              <p>本当に削除しますか？</p>
              <div className={'flex'}>
                <button type="button" className={'bg-gray-500'} onClick={() => setIsDeleteReady(false)}>
                  ☓ キャンセル
                </button>
                <button type="button" className={'bg-red-600'} onClick={handleDeleteConfirm}>
                  ◯ 削除
                </button>
              </div>
            </div>
          )}
          <Link className={'block'} href={`/coffee-bean/${coffeeBeanId}`}>
            ◀ BACK
          </Link>
        </form>
      </section>
    </>
  );
}
