import { jest, expect, describe, test, beforeEach } from "@jest/globals"
import TestUtil from "../_util/testUtil.js"
import config from "../../../server/config.js"
import fs from 'fs'
import fsPromises from 'fs/promises'
import { Service } from "../../../server/service"

const { dir: { publicDirectory } } = config;

describe('#Service', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('#createFileStream',  async () => {
    const currentReadable = TestUtil.generateReadableString([
      'readable-stream-content'
    ])

    jest.spyOn(fs, fs.createReadStream.name).mockReturnValue(currentReadable)
    
    const service = new Service()
    const fileName = 'the-js-song.mp3'
    const fileStream = await service.createFileStream(fileName)

    expect(fileStream).toStrictEqual(currentReadable)
    expect(fs.createReadStream).toHaveBeenCalledWith(fileName)

  })

  test('#getFileInfo',  async () => {
    const mockFileName = 'the-js-song.mp3'
    
    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue()

    const service = new Service()
    const fileInfo = await service.getFileInfo(mockFileName)
    const expectedFileInfo = {
      type: '.mp3',
      name: `${publicDirectory}/${mockFileName}`
    }

    expect(fileInfo).toStrictEqual(expectedFileInfo)
  })


  test('#getFileStream', async () => {

    const currentReadable = TestUtil.generateReadableString([
      'readable-stream-content'
    ])
    const mockFileName = 'custom-song.mp3';
    const mockFileFullPath = `${publicDirectory}/${mockFileName}`

    const service = new Service();

    const fileInfo = {
      type: '.mp3',
      name: mockFileFullPath
    }

    jest.spyOn(
      service, 
      service.getFileInfo.name
    ).mockResolvedValue(fileInfo)

    jest.spyOn(
      service, 
      service.createFileStream.name
    ).mockReturnValue(currentReadable)

    const fileStream = await service.getFileStream(mockFileName)

    expect(fileStream).toStrictEqual({
      type: fileInfo.type,
      stream: currentReadable
    })
    expect(service.createFileStream).toHaveBeenCalledWith(fileInfo.name)
    expect(service.getFileInfo).toHaveBeenCalledWith(mockFileName)
  })
})