import { Context } from 'koa';
import { curly } from 'node-libcurl';
import { env } from '../config/env';
import { checkDominant, DominantResponse } from '../utils/checkDominant';
import { responseBody } from '../utils/response.body';

export const pictureController = async (
    ctx: Context
): Promise<void | Response> => {
    const { id = 1300, format = 'json' } = ctx.params;
    const { data } = await curly.get(
        `${env('MUSEUM_API_URL')}public/collection/v1/objects/${id}`
    );

    const { objectID, primaryImage, message } = data;

    const color = message
        ? undefined
        : await checkDominant(primaryImage).catch(() => undefined);

    const responseData = {
        objectID,
        primaryImage,
        ...(color && color),
    };

    ctx.body = await responseBody(responseData as DominantResponse, format);
};
