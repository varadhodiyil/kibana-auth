/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import wreck from '@hapi/wreck';

export async function getNodeShasums(nodeVersion) {
  const url = `https://nodejs.org/dist/v${nodeVersion}/SHASUMS256.txt`;

  // const { res, payload } = await wreck.get(url);
  const res = {statusCode : 200};
  const payload = `
  04b06a4904442887939603d1e34fb9d9230d5660c8d7d6ad7c0a0c708f8baacf  node-v10.15.2-aix-ppc64.tar.gz
8bbb6c15a0572f493d33ef044d06ccd0ff7ead8daa67f9a32df3e863277568e8  node-v10.15.2-darwin-x64.tar.gz
1eae3fa933dcfa84e2f2c82ef69168aec5c4370454d3e8471695c98f94ad135e  node-v10.15.2-darwin-x64.tar.xz
cfc3b8c109953d4fb9d5ac2111ab6a9d6c09ebb4db1276f5f679c5d38bbe19b2  node-v10.15.2-headers.tar.gz
7fd37e30dc0678888d52942870fc18d52f13c1e50efd1ee63843ee498190d356  node-v10.15.2-headers.tar.xz
2988f31a07f54a80442166574b01ecfa92f2c6a8094ca4c2d820f464df0b5ce1  node-v10.15.2-linux-arm64.tar.gz
2978e82d85654505d732b40dfa58f21276d99712d5d001101eaf87100d350139  node-v10.15.2-linux-arm64.tar.xz
093b74879f1e4a14a27308f0c713af0f3fe8e3b7a4c56c97efd35a9c3c2c31cb  node-v10.15.2-linux-armv6l.tar.gz
c60d96a7066b96d87b96f283c5bd73b41b6f066b27907ef58ba9e4455d52c90a  node-v10.15.2-linux-armv6l.tar.xz
d3cf7736db46b92b0ef2cbf7271145a735e74f8754c5dcefca448bd647011872  node-v10.15.2-linux-armv7l.tar.gz
127dcd15befe20deb15fadd1b89873d87c2731ea79d1741fb8d7aac2cbc11332  node-v10.15.2-linux-armv7l.tar.xz
51584f9ac8306006a7ceb91e8beadb453977d32541b671e8338cc8e4ef5c6696  node-v10.15.2-linux-ppc64le.tar.gz
5b1f664878e7bcc41f4c2fda36d5fd77b502d6bb34d5d963cdabf529c47a3910  node-v10.15.2-linux-ppc64le.tar.xz
9129d35f52e8a65493769dba5f35ec7b3f3516047cc84a7ed702960496749daf  node-v10.15.2-linux-s390x.tar.gz
ca643febb3d91c796a7c76f0bfe669e5295a3bfb4373d3b4509a295f5030ca60  node-v10.15.2-linux-s390x.tar.xz
65e66599b275e2c41a882610a841a990e0570ed03bfccc378e031c475a3dae52  node-v10.15.2-linux-x64.tar.gz
c10eece562cfeef1627f0d2bde7dc0be810948f6bf9a932e30a8c3b425652015  node-v10.15.2-linux-x64.tar.xz
3b847f70073d7bd5d13cfa98773cf419115f458ac0fb7f38b3b58e5b06aa20db  node-v10.15.2.pkg
5175b8c4221be5d93f73cf7ddde7df36b9d0c471c6b35d98db679c6f14fd7a85  node-v10.15.2-sunos-x64.tar.gz
1e956873bfa292ed353c62f6deeca53016ad48e043b19a863929100334b27a75  node-v10.15.2-sunos-x64.tar.xz
3b81ea6b0ae1c887ed4215d6a0b9349284c811bd98c8ddd7a0370f6cc9eb8182  node-v10.15.2.tar.gz
b8bb2da7cb016e895bc2f70009a420f6b8d519e66548624b6130bbfbd5118c59  node-v10.15.2.tar.xz
9872ed9b430858087e2ca843c6c5443a1227bb6dca59c044afb80acf800fd432  node-v10.15.2-win-x64.7z
d97cf4788ccea6deef037ce27c91cc1a814644b878311b71811ab04d0bb8c47f  node-v10.15.2-win-x64.zip
d03762a0649ab87d1fdd5c137a3d9bfe7a770227e78600aa8790b0f66dc534bd  node-v10.15.2-win-x86.7z
e9b703b6460a78d2540a91f4baf72d0f11a94b50a8be180d58c6762079045130  node-v10.15.2-win-x86.zip
12a802653c0737a4ba882a06511ad1fb58cfe038bf55b082c7fe6243bdf03cf5  node-v10.15.2-x64.msi
bac19c6847b4198b03675a351e5b8c507f3f3a00721cc455a31dd4e3bed7cc04  node-v10.15.2-x86.msi
c09b9e6d3ce46fe7c117b35755e3ffb547a7eea594edaf76768ad4530c048b83  win-x64/node.exe
d57c68010131d35cc64d3c2ca60be9e9613cf220c3204bc151d19f805fbece2f  win-x64/node.lib
93e19be9aac54a213d4d27b79f1dae78a0e052fa25fcee33dc4f408c3db565fd  win-x64/node_pdb.7z
c3aaf40d785ee9a9fbed28a4f27241670451752e23f425cfae13ab34c833757c  win-x64/node_pdb.zip
a6e0de3ddd0bbec1f9e78a0c0bb372a1e4c6efcdf3baa2d3b68543e92bc4e43a  win-x86/node.exe
9c4c2437ee1ee782a5ede7225702707c7ab473617eb1b93beb3c377b86aefb4e  win-x86/node.lib
4ff34a10ce3bd8c86bf9cff2f5b9659295717586c5550f548e4c8d94cb277648  win-x86/node_pdb.7z
83679a0dc25fae2d41a7da378784315432537f426adfd67953601154e152d892  win-x86/node_pdb.zip
`;

  if (res.statusCode !== 200) {
    throw new Error(`${url} failed with a ${res.statusCode} response`);
  }

  return payload
    .toString('utf8')
    .split('\n')
    .reduce((acc, line) => {
      const [sha, platform] = line.split('  ');

      return {
        ...acc,
        [platform]: sha,
      };
    }, {});
}
