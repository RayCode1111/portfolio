import { NextResponse } from 'next/server';

const OPENPANEL_API_URL = 'https://api.openpanel.dev';
const OPENPANEL_CLIENT_ID = process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID;
const OPENPANEL_SECRET_ID = process.env.OPENPANEL_API_SECRET_ID;
const OPENPANEL_PROJECT_ID = process.env.OPENPANEL_PROJECT_ID;
export async function GET() {
  try {
    if (
      !OPENPANEL_CLIENT_ID ||
      !OPENPANEL_SECRET_ID ||
      !OPENPANEL_PROJECT_ID ||
      OPENPANEL_CLIENT_ID === '***' ||
      OPENPANEL_SECRET_ID === '***' ||
      OPENPANEL_PROJECT_ID === '***'
    ) {
      return NextResponse.json({
        totalUV: '-',
        dailyUV: '-',
      });
    }

    // 获取总访问数据
    const response = await fetch(`${OPENPANEL_API_URL}/export/events?projectId=${OPENPANEL_PROJECT_ID}&event=screen_view`, {
      headers: {
        'openpanel-client-id': OPENPANEL_CLIENT_ID,
        'openpanel-client-secret': OPENPANEL_SECRET_ID,
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        totalUV: '-',
        dailyUV: '-',
      });
    }

    const data = await response.json();
    const totalUV = data?.meta?.totalCount ?? '-';

    // 获取今日访问数据
    // 昨天的 yyyy-MM-dd
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 今天的 yyyy-MM-dd
    const todayStr = today.toISOString().split('T')[0];
    const todayResponse = await fetch(`${OPENPANEL_API_URL}/export/events?projectId=${OPENPANEL_PROJECT_ID}&event=screen_view&start=${yesterdayStr}&end=${todayStr}`, {
      headers: {
        'openpanel-client-id': OPENPANEL_CLIENT_ID,
        'openpanel-client-secret': OPENPANEL_SECRET_ID,
      },
    });

    if (!todayResponse.ok) {
      return NextResponse.json({
        totalUV,
        dailyUV: '-',
      });
    }

    const todayData = await todayResponse.json();
    const dailyUV = todayData?.meta?.totalCount ?? '-';

    return NextResponse.json({
      totalUV,
      dailyUV,
    });
  } catch (error) {
    return NextResponse.json({
      totalUV: '-',
      dailyUV: '-',
    });
  }
}