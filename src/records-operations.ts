/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import _ from 'lodash';

/**
 * Calculates the difference between 2 records (similar to a set difference). Returns rows in `recordA` which are not present
 * in `recordB`. Two rows are equal if their values are the same.
 * @param recordA Record A. The returned value of this function is a subset of this record.
 * @param recordB Record B. Elements to be substracted from Record A.
 */
export const calculateDifference = (recordA: Record<number, string[]>, recordB: Record<number, string[]>): any[][]  => {
    const arrayA = recordToArray(recordA);
    const arrayB = recordToArray(recordB);
    return _.differenceWith(arrayA, arrayB, (a, b) => a[1].join('_') == b[1].join('_'));
  };

const recordToArray = (record: Record<number, string[]>): any[] => {
    return Object.keys(record).map(x => {
        const idx = parseInt(x);
        return [idx, record[idx]];
    });
};
