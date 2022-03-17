import { jest, expect, describe, test, beforeEach } from "@jest/globals"
import { Controller } from "../../../server/controller.js";
import { Service } from "../../../server/service";
import TestUtil from "../_util/testUtil"

describe('#Controller', () =>{

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  test('#getFileStream', async () => {
    const mockStream = TestUtil.generateReadableString([
      'readable-stream-content'
    ])
    const mockType = '.css'
    const mockFileName = 'index.css'
    

    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileStream.name
    ).mockResolvedValue({
      stream: mockStream,
      type: mockType
    })

    const controller = new Controller()

    const { stream, type } = await controller.getFileStream(mockFileName)

    expect(stream).toStrictEqual(mockStream)
    expect(type).toStrictEqual(mockType)
  })

})