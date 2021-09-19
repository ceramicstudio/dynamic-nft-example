// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import multiparty from "multiparty";
import { Web3Storage } from "web3.storage";
import * as fs from "fs";
import { File, Blob } from "@web-std/file";

type CidResponse = {
  cid: string;
};

type Form = {
  fields: any;
  files: any;
};

function parseForm(req: NextApiRequest): Promise<Form> {
  const form = new multiparty.Form();
  return new Promise<Form>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          fields: fields,
          files: files,
        });
      }
    });
  });
}

function getWeb3Token(): string {
  const token = process.env.WEB3STORAGE_TOKEN;
  if (!token) throw new Error(`Misconfigured: web3.storage token`);
  return token;
}

const web3Storage = new Web3Storage({ token: getWeb3Token() });

async function handler(req: NextApiRequest, res: NextApiResponse<CidResponse>) {
  const form = await parseForm(req);
  const file = form.files.file[0];
  const name = file.originalFilename;
  const f = new File(fs.readFileSync(file.path), name);
  const cid = await web3Storage.put([f]);
  res.status(200).json({ cid: cid.toString() });
}

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
export default handler;
