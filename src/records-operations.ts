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

import { differenceWith, isEqual } from 'lodash';

/**
 * Renames properties in a record using a mapping between current and new names.
 * @param record The record whose properties should be renamed.
 * @param fieldsMapping A mapping of current property names to new property names.
 * @returns A new record with the properties' names changed according to the mapping.
 */
const renameProperties = (record: Record<string, string | string[]>, fieldsMapping: Map<string, string>
): Record<string, string | string[]> => {
    const renamed: Record<string, string | string[]> = {};
    Object.entries(record).forEach(([propertyName, propertyValue]) => {
        const newName = fieldsMapping.get(propertyName) ?? propertyName;
        renamed[newName] = propertyValue;
    });
    return renamed;
};

/**
 * Find missing foreign keys by calculating the difference between 2 dataset keys (similar to a set difference).
 * Returns rows in `dataKeysA` which are not present in `dataKeysB`.
 * @param datasetKeysA Keys of the dataset A. The returned value of this function is a subset of this array.
 * @param datasetKeysB Keys of the dataset B. Elements to be substracted from `datasetKeysA`.
 * @param fieldsMapping Mapping of the field names so the keys can be compared correctly.
 */
export const findMissingForeignKeys = (
    datasetKeysA: [number, Record<string, string | string[]>][],
    datasetKeysB: [number, Record<string, string | string[]>][],
    fieldsMapping: Map<string, string>
): [number, Record<string, string | string[]>][] => {
    const diff = differenceWith(datasetKeysA, datasetKeysB, (a, b) => isEqual(a[1], renameProperties(b[1], fieldsMapping)));
    return diff;
};
