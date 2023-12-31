import { format } from 'date-fns';
import Link from 'next/link';

import { prisma } from '@/libs/prisma/prismaClient';

export default async function CoffeeBeanDetailPage({ params: { coffeeBeanId } }: { params: { coffeeBeanId: string } }) {
  // TODO: get auth user
  const userId = 2;

  const beans = await prisma.coffeeBean.findMany({
    include: { process: true, roast: true },
    where: { coffeeBeanId: Number(coffeeBeanId), userId },
  });

  return (
    <>
      <section>
        <table className={'w-full'}>
          <thead>
            <tr>
              <th>ID</th>
              <th>名前</th>
              <th>原産国</th>
              <th>品種</th>
              <th>精製方法</th>
              <th>焙煎度</th>
              <th>評価</th>
              <th>メモ</th>
              <th>購入日</th>
              <th>作成日</th>
            </tr>
          </thead>
          <tbody>
            {beans.map(
              ({ coffeeBeanId, createdAt, name, note, origin, process, purchaseDate, rating, roast, variety }) => (
                <tr key={coffeeBeanId}>
                  <td>{coffeeBeanId}</td>
                  <td>{name}</td>
                  <td>{origin}</td>
                  <td>{variety}</td>
                  <td>{process?.name ?? '-'}</td>
                  <td>{roast?.name ?? '-'}</td>
                  <td>{rating}</td>
                  <td>{note}</td>
                  <td>{purchaseDate ? format(purchaseDate, 'yyyy-MM-dd') : '-'}</td>
                  <td>{createdAt ? format(createdAt, 'yyyy-MM-dd') : '-'}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </section>

      <Link className={'block'} href={`/coffee-bean/${coffeeBeanId}/edit`}>
        ▶ EDIT
      </Link>
      <Link className={'block'} href={'/coffee-bean'}>
        ◀ BACK
      </Link>
    </>
  );
}
